package com.volunhub.backend.config;

import com.volunhub.backend.entity.Categoria;
import com.volunhub.backend.repository.CategoriaRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CategoriaDataInitializer {

    @Bean
    public ApplicationRunner categoriaSeeder(CategoriaRepository categoriaRepository) {
        return args -> {
            if (categoriaRepository.count() > 0) {
                return;
            }

            categoriaRepository.saveAll(List.of(
                criarCategoria("Apoio Social", "Projetos voltados a acolhimento, assistencia e suporte comunitario."),
                criarCategoria("Cultura", "Projetos de arte, leitura, eventos culturais e expressao local."),
                criarCategoria("Educacao", "Projetos de reforco escolar, alfabetizacao, oficinas e ensino."),
                criarCategoria("Meio Ambiente", "Projetos de sustentabilidade, limpeza, reciclagem e preservacao."),
                criarCategoria("Saude", "Projetos de prevencao, orientacao e apoio ao bem-estar da comunidade.")
            ));
        };
    }

    private Categoria criarCategoria(String nome, String descricao) {
        Categoria categoria = new Categoria();
        categoria.setNome(nome);
        categoria.setDescricao(descricao);
        return categoria;
    }
}
